"use client"

import * as React from "react"
import * as SwitchPrimitives from "@radix-ui/react-switch"
import styles from "./switch.module.css"
import { DrizzleLogo, PrismaLogo } from "./icons"

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitives.Root
    className={`${styles.root} ${className || ""}`}
    {...props}
    ref={ref}
  >
    <SwitchPrimitives.Thumb className={styles.thumb}>
      <div className={styles.iconWrapper}>
        <PrismaLogo className={styles.prismaIcon} />
        <DrizzleLogo className={styles.drizzleIcon} />
      </div>
    </SwitchPrimitives.Thumb>
  </SwitchPrimitives.Root>
))
Switch.displayName = SwitchPrimitives.Root.displayName

export { Switch }
