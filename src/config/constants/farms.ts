import tokens from './tokens'
import { FarmConfig } from './types'

const farms: FarmConfig[] = [
  /**
   * These 3 farms (PID 0, 1, 2) should always be at the top of the file.
   */
  {
    pid: 0,
    lpSymbol: 'YOK',
    lpAddresses: {
      1024777: '0x37D8a33814eBC6BB300a734237DA60730c91d0a8',
      71393: '0xc5e133E6B01b2C335055576C51A53647B1b9b624',
    },
    token: tokens.syrup,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 1,
    lpSymbol: 'YOK-CKB LP',
    lpAddresses: {
      1024777: '0x9FA1d6306fbB2212E67553C7C96BCfE233465179',
      71393: '0xEE6D26C3E9Bb1317F8A9Aa13A2fb0B99Fd36bbf8',
    },
    token: tokens.cake,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 2,
    lpSymbol: 'USDC-CKB LP',
    lpAddresses: {
      1024777: '0x6AF04dD3d05A3c7a55FC1903803276F795996408',
      71393: '0x6d8E22774BE463F20981E9A3bACCD8f7BB1949cd',
    },
    token: tokens.usdc,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 3,
    lpSymbol: 'MEOW-CKB LP',
    lpAddresses: {
      71393: '0x6a7a94344978e8db62819C36887bC88420f9B564',
    },
    token: tokens.meow,
    quoteToken: tokens.wbnb,
    extraRewards: {
      rule: 'meow farms rule',
      rewardToken: tokens.meow,
      stakingRewards: '0x37EDbC1Ce0BEBD4dA035c4F22e2269EEa0B9Da75',
    },
  },
]

export default farms
