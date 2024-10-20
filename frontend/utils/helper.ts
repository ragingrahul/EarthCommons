export function formatAddress(address: string, prefixLength = 4, suffixLength = 3): string {
    if (address.length <= prefixLength + suffixLength) {
        return address;
    }
    return `${address.slice(0, prefixLength)}...${address.slice(-suffixLength)}`;
  }