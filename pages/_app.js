function GlobalStyle() {
   return (
      <style global jsx>{`
         * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            list-style: none;
            overflow-wrap: break-word;
            }
            body {
            font-family: 'Open Sans', sans-serif;
            }
            /* App fit Height */ 
            html, body, #__next {
            min-height: 100vh;
            display: flex;
            flex: 1;
            }
            #__next {
            flex: 1;
            }
            #__next > * {
            flex: 1;
            }
            /* ./App fit Height */ 
         `}</style>
   );
}

export default function ChatApp({Component, pageProps}) {
   return (
      <>
         <GlobalStyle />
         <Component {...pageProps} />
      </>
   )
}
