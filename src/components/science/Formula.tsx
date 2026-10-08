/**
 * Formula setter. The data writes `H_2O` and `30×10^3`; this turns the `_`
 * and `^` runs into real <sub>/<sup> so the equations read as chemistry
 * rather than as source code. Everything else passes through untouched.
 */
export function Formula({ source }: { source: string }) {
  // digits after the mark are the index (H_2O: only the 2); a letter run is
  // a named index and taken whole (ϑ_Oberfläche, s_d)
  const parts = source.split(/([_^](?:[0-9]+|[A-Za-zÄÖÜäöüß]+))/g).filter(Boolean);
  return (
    <>
      {parts.map((p, i) => {
        if (p.startsWith("_")) return <sub key={i}>{p.slice(1)}</sub>;
        if (p.startsWith("^")) return <sup key={i}>{p.slice(1)}</sup>;
        return <span key={i}>{p}</span>;
      })}
    </>
  );
}
