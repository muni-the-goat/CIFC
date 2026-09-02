"use client";

import type { ReactNode } from "react";
import { Liquid } from "liquid-gooey";

/* Loaded only where it can run well — see Faq.tsx. Kept in its own file
   so next/dynamic can code-split it out of the mobile bundle entirely. */
export default function FaqSurface({
  question,
  answer,
}: {
  question: ReactNode;
  answer: ReactNode;
}) {
  return (
    <Liquid blur={11} contrast={24} fill="var(--grey-50)" filterPadding={28}>
      <Liquid.Item observe>{question}</Liquid.Item>
      <Liquid.Item observe>{answer}</Liquid.Item>
    </Liquid>
  );
}
