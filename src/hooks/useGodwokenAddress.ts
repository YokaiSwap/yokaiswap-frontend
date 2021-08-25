import { useMemo } from 'react'

import { ethEoaAddressToGodwokenShortAddress } from '../godwoken'

export function useGodwokenAddress(ethAddr?: string | null): string | undefined {
  return useMemo(() => (ethAddr != null ? ethEoaAddressToGodwokenShortAddress(ethAddr) : undefined), [ethAddr])
}
