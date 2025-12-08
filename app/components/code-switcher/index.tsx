import { highlight, RawCode } from "codehike/code"
import { ClientCodeSwitcher } from "./client"

export default async function CodeSwitcher({
  prismaCode,
  drizzleCode,
  lang = "typescript",
  meta = "",
  type = "tabs",
}: {
  prismaCode: string
  drizzleCode: string
  lang?: string
  meta?: string
  type?: "tabs" | "switch"
}) {
  const prismaRaw: RawCode = { value: prismaCode, lang, meta }
  const drizzleRaw: RawCode = { value: drizzleCode, lang, meta }

  const prismaHighlighted = await highlight(prismaRaw, "github-from-css")
  const drizzleHighlighted = await highlight(drizzleRaw, "github-from-css")

  return (
    <ClientCodeSwitcher
      prismaHighlighted={prismaHighlighted}
      drizzleHighlighted={drizzleHighlighted}
      type={type}
    />
  )
}
