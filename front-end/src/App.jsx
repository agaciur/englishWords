import styles from "./App.module.css"
import { Button } from "./components/Button/Button"
import { Panel } from "./components/Panel/Panel"
import { Timer } from './components/Timer/Timer'
import { useCallback, useState } from "react"
import { ErrorMessage } from './components/ErrorMessage/ErrorMessage'

function App() {
  const [isPanelShown, setIsPanelShown] = useState(true)
  const [error, setError] = useState(null)

  const showError = useCallback((e) => {
    setError(e.message);
    setTimeout(() => {
      setError(null)
    }, 3000)
  }, [])

  return (
    <main className={styles.main}>
         {error && <ErrorMessage>{error}</ErrorMessage>}
      <Button onClick={() => setIsPanelShown(prev => !prev)}>{isPanelShown ? "Schowaj panel" : "Pokaż panel"}</Button>
      {isPanelShown && <Panel showError={showError} />}
      <Timer />
    </main>
  )
}

export default App
