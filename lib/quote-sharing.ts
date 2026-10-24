export function imageShareIssue({ secureContext, hasShare, fileSupport }: {
  secureContext: boolean; hasShare: boolean; fileSupport?: boolean;
}): string | null {
  if (!secureContext) return "Bu adres HTTP ile açılmış. Telefonun paylaşım menüsü için HTTPS bağlantısı gerekiyor. İstersen Görseli indir düğmesini kullanabilirsin.";
  if (!hasShare) return "Bu tarayıcı paylaşım menüsünü desteklemiyor. Görseli indir düğmesini kullanabilirsin.";
  if (fileSupport === false) return "Bu tarayıcı görsel dosyası paylaşımını desteklemiyor. Görseli indir düğmesini kullanabilirsin.";
  // Older implementations can expose share without canShare. Attempt the actual
  // share in that case rather than treating a missing capability probe as false.
  return null;
}
