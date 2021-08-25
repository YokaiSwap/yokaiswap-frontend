import { ContextApi } from 'contexts/Localization/types'
import { PageMeta } from './types'

export const DEFAULT_META: PageMeta = {
  title: 'YokaiSwap',
  description: 'Earn YOK through yield farming, then stake it in Pools to earn more tokens!',
  image: '',
}

export const getCustomMeta = (path: string, t: ContextApi['t']): PageMeta => {
  switch (path) {
    case '/':
      return {
        title: `${t('Home')} | ${t('YokaiSwap')}`,
      }
    case '/competition':
      return {
        title: `${t('Trading Battle')} | ${t('YokaiSwap')}`,
      }
    case '/prediction':
      return {
        title: `${t('Prediction')} | ${t('YokaiSwap')}`,
      }
    case '/farms':
      return {
        title: `${t('Farms')} | ${t('YokaiSwap')}`,
      }
    case '/pools':
      return {
        title: `${t('Pools')} | ${t('YokaiSwap')}`,
      }
    case '/lottery':
      return {
        title: `${t('Lottery')} | ${t('YokaiSwap')}`,
      }
    case '/collectibles':
      return {
        title: `${t('Collectibles')} | ${t('YokaiSwap')}`,
      }
    case '/ifo':
      return {
        title: `${t('Initial Farm Offering')} | ${t('YokaiSwap')}`,
      }
    case '/teams':
      return {
        title: `${t('Leaderboard')} | ${t('YokaiSwap')}`,
      }
    case '/profile/tasks':
      return {
        title: `${t('Task Center')} | ${t('YokaiSwap')}`,
      }
    case '/profile':
      return {
        title: `${t('Your Profile')} | ${t('YokaiSwap')}`,
      }
    default:
      return null
  }
}
