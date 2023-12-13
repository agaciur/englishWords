import { useEffect, useState, useMemo } from "react"
import { FilterButton } from "../FilterButton/FilterButton"
import { List } from "../List/List"
import styles from "./Panel.module.css"
import { Form } from "../Form/Form"
import { getCategoryInfo } from '../../utils/getCategoryInfo'
import { Info } from '../Info/Info'

const url = "http://localhost:3000/words"

export function Panel({ showError }) {
  const [data, setData] = useState([])
  const [isloading, setIsloading] = useState(true)
  const [category, setCategory] = useState(null)

  useEffect(() => {
    let isCanceled = false
    const params = category === null ? "" : `?category=${category}`

    fetch(`${url}${params}`)
        .then(response => {
          if (response.ok) { 
           return response.json() 
          } 
        throw new Error("Błąd podczas pobierania danych!")
      })
      .then(response => {
      
          if (!isCanceled) {
            setData(response)
            setIsloading(false)
          }
      })
      .catch(showError)
      return () => {
        isCanceled = true
      }
    }, [category, showError])



  const categoryInfo = useMemo(() => getCategoryInfo(category), [category])
  
  function handleFormSubmit(newItem) {
    fetch(url, {
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
    fetch(`${url}/${id}`, {
      method: "DELETE",
    })
      .then(response => {
        if (response.ok) {
          setData(prevData => prevData.filter(item => item.id !== id))
        } else {
          throw new Error("Błąd podczas usuwania!")
        }
      })
      .catch(showError)
  }

  if (isloading) {
    return <p>Ładowanie...</p>
  }
  return (
    <>
   
      <section className={styles.section}>
        <Info>{categoryInfo}</Info>
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
            Czasowniki
          </FilterButton>
        </div>

        <List
          onDeleteClickButton={onDeleteClickButton}
          data={data}></List>
      </section>
    </>
  )
}
