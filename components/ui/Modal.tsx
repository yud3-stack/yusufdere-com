"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";

// Keep overlays outside animated/perspective scenes. React controls visibility;
// opening does not depend on HTMLDialogElement.showModal in mobile WebViews.
export function Modal({ open, onClose, labelledBy, children }: {
  open: boolean; onClose: () => void; labelledBy: string; children: ReactNode;
}) {
  const layer = useRef<HTMLDivElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const dismiss = useRef(onClose);
  const backdropPressed = useRef(false);
  useEffect(() => { dismiss.current = onClose; }, [onClose]);

  useEffect(() => {
    if (!open || !panel.current || !layer.current) return;
    const previouslyFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const scrollX = window.scrollX;
    const scrollY = window.scrollY;
    const body = document.body;
    const saved = { position: body.style.position, top: body.style.top, left: body.style.left,
      width: body.style.width, paddingRight: body.style.paddingRight, overflow: body.style.overflow, htmlOverflow: document.documentElement.style.overflow };
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;
    const paddingRight = Number.parseFloat(getComputedStyle(body).paddingRight) || 0;
    // iOS can scroll the page behind an overlay even when html overflow is hidden.
    body.style.position = "fixed";
    body.style.top = `${-scrollY}px`;
    body.style.left = `${-scrollX}px`;
    body.style.width = "100%";
    if (scrollbar > 0) body.style.paddingRight = `${paddingRight + scrollbar}px`;
    body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    const siblings = Array.from(body.children).filter((element): element is HTMLElement =>
      element instanceof HTMLElement && element !== layer.current && !element.contains(layer.current) && !["SCRIPT", "STYLE", "LINK"].includes(element.tagName));
    const states = siblings.map((element) => ({ element, inert: element.inert, hidden: element.getAttribute("aria-hidden") }));
    states.forEach(({ element }) => { element.inert = true; element.setAttribute("aria-hidden", "true"); });
    const focusable = () => Array.from(panel.current?.querySelectorAll<HTMLElement>(
      'button:not([disabled]), a[href], summary, input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
    ) ?? []).filter((element) => element.getClientRects().length > 0);
    (focusable()[0] ?? panel.current).focus({ preventScroll: true });
    function keydown(event: KeyboardEvent) {
      if (event.key === "Escape") { event.preventDefault(); dismiss.current(); }
      if (event.key !== "Tab") return;
      const targets = focusable();
      const first = targets[0];
      const last = targets[targets.length - 1];
      if (!first) { event.preventDefault(); panel.current?.focus(); }
      else if (event.shiftKey && (document.activeElement === first || !panel.current?.contains(document.activeElement))) {
        event.preventDefault(); last.focus();
      } else if (!event.shiftKey && (document.activeElement === last || !panel.current?.contains(document.activeElement))) {
        event.preventDefault(); first.focus();
      }
    }
    document.addEventListener("keydown", keydown);
    return () => {
      document.removeEventListener("keydown", keydown);
      states.forEach(({ element, inert, hidden }) => {
        element.inert = inert;
        if (hidden === null) element.removeAttribute("aria-hidden"); else element.setAttribute("aria-hidden", hidden);
      });
      Object.assign(body.style, { position: saved.position, top: saved.top, left: saved.left, width: saved.width, paddingRight: saved.paddingRight, overflow: saved.overflow });
      document.documentElement.style.overflow = saved.htmlOverflow;
      window.scrollTo(scrollX, scrollY);
      if (previouslyFocused?.isConnected) previouslyFocused.focus({ preventScroll: true });
    };
  }, [open]);

  if (!open || typeof document === "undefined") return null;
  return createPortal(<div ref={layer} className="public-site quote-modal-layer"
    onPointerDown={(event) => { backdropPressed.current = event.target === event.currentTarget; }}
    onClick={(event) => { if (backdropPressed.current && event.target === event.currentTarget) onClose(); }}>
    <div ref={panel} className="quote-dialog" role="dialog" aria-modal="true" aria-labelledby={labelledBy} tabIndex={-1}>
      {children}
    </div>
  </div>, document.body);
}
