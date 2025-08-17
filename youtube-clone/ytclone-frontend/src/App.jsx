import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import Register from "./pages/Register";
import VideoPlayer from "./pages/VideoPlayer";
import Channel from "./pages/Channel";
import CreateChannel from "./pages/CreateChannel";
import NotFound from "./pages/NotFound";
import { useState } from "react";

export default function App(){
  const [search, setSearch] = useState("");
  return (
    <BrowserRouter>
      <Header onSearch={setSearch} />
      <Routes>
        <Route path="/" element={<Home search={search} />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/register" element={<Register />} />
        <Route path="/video/:id" element={<VideoPlayer />} />
        <Route path="/channel/create" element={<CreateChannel />} />
        <Route path="/channel/:id" element={<Channel />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
