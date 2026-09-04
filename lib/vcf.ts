export function generateVCF() {
  const vcfData = `BEGIN:VCARD
VERSION:3.0
FN:Tanmay Barik
TEL;TYPE=CELL:+918900330904
EMAIL:tanmaybariik@gmail.com
URL:https://tanmaybarik.netlify.app
NOTE:Digital Visiting Card
END:VCARD`;

  const blob = new Blob([vcfData], { type: 'text/vcard' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = 'Tanmay Barik.vcf';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
}
