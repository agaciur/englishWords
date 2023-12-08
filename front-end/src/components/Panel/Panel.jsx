import { useEffect, useState } from "react"
import { ErrorMessage } from "../ErrorMessage/ErrorMessage"
import { FilterButton } from "../FilterButton/FilterButton"
import { List } from "../List/List"
import styles from "./Panel.module.css"
import { Form } from "../Form/Form"

export function Panel() {
  const [data, setData] = useState([])
  const [isloading, setIsloading] = useState(true)
  const [error, setError] = useState(null)
  const [category, setCategory] = useState(null)

  useEffect(() => {
    const data = category === null ? "" : `?category=${category}`
    fetch(`http://localhost:3000/words${data}`).then(response => {
      response.json().then(response => {
        setData(response)
        setIsloading(false)
      })
    })
  }, [category])

  function handleFormSubmit(newItem) {
    fetch("http://localhost:3000/words", {
      method: "POST",
      body: JSON.stringify(newItem),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(res => res.json())
      .then(res => {
        if (category === null || category === res.category) setData(prevData => [...prevData, res])
      })
  }

  function onDeleteClickButton(id) {
    fetch(`http://localhost:3000/words/${id}`, {
      method: "DELETE",
    })
      .then(response => {
        if (response.ok) {
          setData(prevData => prevData.filter(item => item.id !== id))
        } else {
          throw new Error("Błąd podczas usuwania!")
        }
      })
      .catch(e => {
        setError(e.message)
        setTimeout(() => {
          setError(null)
        }, 3000)
      })
  }

  if (isloading) {
    return <p>Ładowanie...</p>
  }
  return (
    <>
      {error && <ErrorMessage>{error}</ErrorMessage>}
      <section className={styles.section}>
        <Form handleFormSubmit={handleFormSubmit} />
        <div className={styles.filters}>
          <FilterButton
            active={category === null}
            onClick={() => setCategory(null)}>
            Wszystko
          </FilterButton>
          <FilterButton
            active={category === "noun"}
            onClick={() => setCategory("noun")}>
            Rzeczowniki
          </FilterButton>
          <FilterButton
            active={category === "verb"}
            onClick={() => setCategory("verb")}>
            Czsowniki
          </FilterButton>
        </div>

        <List
          onDeleteClickButton={onDeleteClickButton}
          data={data}></List>
      </section>
    </>
  )
}
