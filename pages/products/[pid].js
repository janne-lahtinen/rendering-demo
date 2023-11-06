import { Fragment } from "react"
import path from 'path'
import fs from 'fs/promises'

function ProductDetailPage(props) {
  const {loadedProduct} = props

  // If we use fallback true, this kind of solution is needed
  // to prevent the TypeError: Cannot read properties of undefined
  if (!loadedProduct) {
    return <p>Loading...</p>
  }

  return (
    <Fragment>
      <h1>{loadedProduct.title}</h1>
      <p>{loadedProduct.description}</p>
    </Fragment>
  )
}

async function getData() {
  const filePath = path.join(process.cwd(), 'data', 'dummy-backend.json')
  const jsonData = await fs.readFile(filePath)
  const data = JSON.parse(jsonData)

  return data
}

// We don't use useRouter > router.query, because this is done in the server beforehand,
// not in the browser, that's why context > params
export async function getStaticProps(context) {
  const { params } = context
  const productId = params.pid

  const data = await getData()

  const product = data.products.find(product => product.id === productId)

  if (!product) {
    return { notFound: true }
  }

  return { props: {
    loadedProduct: product
  }}
}

export async function getStaticPaths() {
  const data = await getData()
  const ids = data.products.map(product => product.id)
  const pathsWithParams = ids.map(id => ({ params: { pid: id } }))

  return {
    paths: pathsWithParams,
    fallback: true,
  }
}

// export async function getStaticPaths() {
//   return {
//     paths: [
//       { params: { pid: 'p1' } },
//     ],
//     fallback: 'blocking',
//     // fallback: true; This could be better choice if a lot to fetch
//   }
// }

export default ProductDetailPage