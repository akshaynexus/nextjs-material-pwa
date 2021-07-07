import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { Actions, useAppShell } from '../components/providers/AppShellProvider'

export function useDesktopDrawerPosition(
  context: typeof useAppShell,
  key = 'desktopDrawerState'
) {
  const { state, dispatch } = useAppShell()

  useEffect(() => {
    const isOpen = window.localStorage.getItem(key)

    dispatch({
      type: Actions.DESKTOP_DRAWER_IS_OPEN,
      payload: isOpen ? isOpen === 'open' : true
    })
  }, [key, dispatch])

  useEffect(() => {
    window.localStorage.setItem(
      key,
      state.desktopDrawerIsOpen ? 'open' : 'closed'
    )
  }, [state.desktopDrawerIsOpen, key])
}

export function useAppTitle(separator: string, defaultTitle: string) {
  const router = useRouter()
  const [title, setTitle] = useState(defaultTitle)

  useEffect(() => {
    const path = router.pathname
    const found = path.split('/')

    if (found[2]) {
      setTitle(
        found[2]
          .replace('/', separator)
          .replace('-', ' ')
          .split(' ')
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ')
      )
    } else {
      setTitle(defaultTitle)
    }
  }, [separator, router.pathname, defaultTitle])

  return title
}

export function getPWADisplayMode() {
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches
  if (document.referrer.startsWith('android-app://')) {
    return 'twa' // android trusted web activity
    // @ts-expect-error -iOS Safari only
  } else if (navigator.standalone || isStandalone) {
    return 'standalone'
  }

  return 'browser'
}

export function booleanEnv(env: string | undefined, initial: boolean) {
  if (env) {
    return env === 'true'
  }

  return initial
}
