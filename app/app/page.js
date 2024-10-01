import Image from "next/image";
//import Nav from "./components/nav";
import Sidebar from "./components/Sidebar";
import Homepage from "./components/Homepage";
import Idea from "./components/Idea";

export default function Home() {
  return (
    <>
    
    <Homepage/>
    <Sidebar/>
    <Idea/>
    </>
  );
}
