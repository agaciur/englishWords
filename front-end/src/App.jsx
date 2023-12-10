import styles from "./App.module.css"
import { Button } from "./components/Button/Button"
import { Panel } from "./components/Panel/Panel"
import { useState } from "react"

function App() {
  const [isPanelShown, setIsPanelShown] = useState(true)
  return (
    <main className={styles.main}>
      <Button onClick={() => setIsPanelShown(prev => !prev)}>{isPanelShown ? "Schowaj panel" : "Pokaż panel"}</Button>
      {isPanelShown && <Panel />}
    </main>
  )
}

export default App
