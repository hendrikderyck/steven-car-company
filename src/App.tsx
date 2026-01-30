import { BrowserRouter, Routes, Route } from "react-router-dom"
import { Layout } from "./components/Layout"
import { Home } from "./pages/Home"
import { Aanbod } from "./pages/Aanbod"
import { AanbodDetail } from "./pages/AanbodDetail"
import { Diensten } from "./pages/Diensten"
import { OverOns } from "./pages/OverOns"
import { Contact } from "./pages/Contact"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="aanbod" element={<Aanbod />} />
          <Route path="aanbod/:id" element={<AanbodDetail />} />
          <Route path="diensten" element={<Diensten />} />
          <Route path="over-ons" element={<OverOns />} />
          <Route path="contact" element={<Contact />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
