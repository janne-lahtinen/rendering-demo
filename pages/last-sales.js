import { useEffect, useState } from "react"
import useSWR from 'swr'

function LastSalesPage(props) {
  const [sales, setSales] = useState(props.sales)
  // const [isLoading, setIsLoading] = useState(true)

  const { data, error } = useSWR(
    'https://next-client-db-default-rtdb.europe-west1.firebasedatabase.app/sales.json',
    (url) => fetch(url).then(res => res.json())
  )

  useEffect(() => {
    if (data) {
      const transformedSales = []

      for (const key in data) {
        transformedSales.push({
          id: key,
          username: data[key].username,
          volume: data[key].volume
        })
      }
      setSales(transformedSales)
    }
  }, [data])

  // No server side rendering:
  // useEffect(() => {
  //   fetch(
  //     'https://next-client-db-default-rtdb.europe-west1.firebasedatabase.app/sales.json'
  //   ).then((res) => res.json())
  //   .then(data => {
  //     const transformedSales = []
      
  //     for (const key in data) {
  //       transformedSales.push({
  //         id: key,
  //         username: data[key].username,
  //         volume: data[key].volume
  //       })
  //     }

  //     setSales(transformedSales)
  //     setIsLoading(false)
  //   })
  // }, [])

  if (error) {
    return <p>Failed to load.</p>
  }

  if (!data && !sales) {
    return <p>Loading...</p>
  }

  return (
    <ul>
      {sales.map((sale) => (
        <li key={sale.id}>
          {sale.username} - {sale.volume} €
        </li>
      ))}
    </ul>
  )
}

// With promise chaining:
// export async function getStaticProps() {
//   return fetch(
//       'https://next-client-db-default-rtdb.europe-west1.firebasedatabase.app/sales.json'
//     ).then((res) => res.json())
//     .then((data) => {
//       const transformedSales = []

//       for (const key in data) {
//         transformedSales.push({
//           id: key,
//           username: data[key].username,
//           volume: data[key].volume
//         })
//       }

//       return { props: { sales: transformedSales }, revalidate: 10 }
//     }
//   )
// }

export async function getStaticProps() {
  const response = await fetch(
    'https://next-client-db-default-rtdb.europe-west1.firebasedatabase.app/sales.json'
  )
  const data = await response.json()
  const transformedSales = []

  for (const key in data) {
    transformedSales.push({
      id: key,
      username: data[key].username,
      volume: data[key].volume
    })
  }

  return { props: { sales: transformedSales }, revalidate: 10 }
}

export default LastSalesPage