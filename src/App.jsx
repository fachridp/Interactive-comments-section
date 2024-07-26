import Comments from "./components/Comments";

export default function App() {
  return (
    <>
      <main className="mx-[1.04rem] my-5 selection:bg-light-grayish-blue selection:text-black space-y-3">
        <section>
          <Comments />
        </section>
      </main>
    </>
  )
}