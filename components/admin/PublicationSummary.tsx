export function PublicationSummary({ published, total }: { published: number; total: number }) {
  const percentage = total ? Math.round(published / total * 100) : 0;

  return <div className="admin-publication-summary">
    <div className="admin-publication-number"><strong>{total ? `%${percentage}` : "—"}</strong><span>{total ? "içeriğin yayında" : "Henüz içerik yok"}</span></div>
    <div className="admin-publication-progress" role="progressbar" aria-label="Yayındaki içerik oranı" aria-valuemin={0} aria-valuemax={100} aria-valuenow={percentage}><span style={{ width: `${percentage}%` }} /></div>
    <p>{total ? `${total} içeriğin ${published} tanesi okuyucularınla buluşuyor.` : "İlk içeriğini eklediğinde yayın özetin burada görünecek."}</p>
  </div>;
}
