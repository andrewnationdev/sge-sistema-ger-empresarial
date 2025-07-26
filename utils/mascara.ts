export function formatPhoneNumber(phoneNumber: string | null | undefined): string {
  if (!phoneNumber) {
    return 'N/A';
  }

  // Remove tudo que não for dígito
  const cleaned = ('' + phoneNumber).replace(/\D/g, '');
  
  const match = cleaned.match(/^(\d{2})(\d{4,5})(\d{4})$/);

  if (match) {
    const ddd = match[1];
    const firstPart = match[2];
    const lastPart = match[3];

    return `(${ddd}) ${firstPart}-${lastPart}`;
  }

  return phoneNumber;
}