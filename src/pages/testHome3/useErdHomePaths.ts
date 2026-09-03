import { useOutletContext } from 'react-router-dom'
import {
  ERD_PRODUCTION_HOME,
  erdHomePath,
  erdHomeRoot,
} from './erdHomePaths'

export type ErdHomeOutletContext = {
  erdBasePath: string
}

export function useErdHomePaths() {
  const context = useOutletContext<ErdHomeOutletContext | undefined>()
  const basePath = context?.erdBasePath ?? ERD_PRODUCTION_HOME
  const homePath = erdHomeRoot(basePath)

  return {
    basePath,
    homePath,
    projectPath: (segment: string) => erdHomePath(basePath, segment),
  }
}
