import { Head, Html, Main, NextScript} from 'next/document'

export default function Document() {
    return (<Html>
            <Head>
                <title>MAKEWISH</title>
                <link rel="shortcut icon" href="/favicon.ico" />
            </Head>
            <body>
            <Main />
            <NextScript/>
            </body>
        </Html>
    )
}
