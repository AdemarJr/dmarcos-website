"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { apiUrl } from "@/lib/api-url"
import { digitsOnly, maskCnpjInput } from "@/lib/format-display"

interface LoginDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function LoginDialog({ open, onOpenChange }: LoginDialogProps) {
  const [cnpj, setCnpj] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch(apiUrl("/api/login"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cnpj: digitsOnly(cnpj), senha: password }),
      })
      const data = (await res.json()) as Record<string, unknown>

      const token =
        (typeof data.token === "string" && data.token) ||
        (typeof data.Token === "string" && data.Token) ||
        (typeof data.access_token === "string" && data.access_token) ||
        (typeof data.accessToken === "string" && data.accessToken)

      const explicitFail = data.auth === false || data.success === false
      const ok = res.ok && Boolean(token) && !explicitFail

      // API externa costuma retornar: { auth: true, token, cliente } — aceitamos variações de nome do token
      if (ok && token) {
        localStorage.setItem("dmarcos_auth", "1");
        localStorage.setItem("dmarcos_token", String(token));
        try {
          const cliente = (data.cliente as Record<string, unknown>) || {}
          const nomeEmpresa = String(
            cliente.NOME_CLIENTE ?? cliente.RAZAO_SOCIAL ?? cliente.FANTASIA ?? ""
          )
          const cnpjFromApi =
            cliente.INSC_CGC_CLIENTE ?? cliente.CNPJ ?? cliente.cnpj ?? cnpj
          localStorage.setItem(
            "dmarcos_cliente",
            JSON.stringify({ nomeEmpresa, cnpj: String(cnpjFromApi) })
          )
        } catch {
          // se falhar, segue fluxo normalmente
        }
        setLoading(false);
        onOpenChange(false);
        router.push("/consultas/di-registradas");
      } else {
        const msg =
          (typeof data.error === "string" && data.error) ||
          (typeof data.message === "string" && data.message) ||
          (typeof data.mensagem === "string" && data.mensagem) ||
          "Erro ao autenticar."
        setError(msg)
        setLoading(false);
      }
    } catch (err) {
      setError("Erro ao conectar ao servidor.");
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Área do Cliente</DialogTitle>
          <DialogDescription>Entre com suas credenciais para acessar a consulta de processos.</DialogDescription>
        </DialogHeader>
          <form onSubmit={handleLogin} className="space-y-4 mt-4">
            {error && (
              <div className="text-red-500 text-sm">{error}</div>
            )}
            <div className="space-y-2">
              <Label htmlFor="cnpj">CNPJ</Label>
              <Input
                id="cnpj"
                type="text"
                inputMode="numeric"
                autoComplete="username"
                placeholder="00.000.000/0000-00"
                value={cnpj}
                onChange={(e) => setCnpj(maskCnpjInput(e.target.value))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
              disabled={loading}
            >
              {loading ? "Entrando..." : "Entrar"}
            </Button>
          </form>
      </DialogContent>
    </Dialog>
  )
}
