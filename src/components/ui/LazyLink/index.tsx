import Link, { LinkProps } from "next/link";
import { AnchorHTMLAttributes, forwardRef } from "react";

type LazyLinkProps = LinkProps & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps>;

/**
 * Un componente Link personalizado que desactiva el prefetch por defecto.
 * Útil para reducir la carga innecesaria en el servidor y limpiar los logs de producción.
 */
const LazyLink = forwardRef<HTMLAnchorElement, LazyLinkProps>(
  ({ prefetch = false, ...props }, ref) => {
    return <Link ref={ref} prefetch={prefetch} {...props} />;
  }
);

LazyLink.displayName = "LazyLink";

export default LazyLink;
