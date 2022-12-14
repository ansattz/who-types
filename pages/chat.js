import {Box, Text, TextField, Image, Button} from '@skynexui/components';
import {useRouter} from 'next/router';
import React from 'react';
import appConfig from '../config.json';
import {createClient} from '@supabase/supabase-js';
import {ButtonSendSticker} from "../src/components/ButtonSendSticker";

const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp4eGJxZHZxZ2ZjdHpkbHJ3eWJmIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NjUyNjc4NDEsImV4cCI6MTk4MDg0Mzg0MX0.4I2eWf9i6YT6NidPQtLi8LEp08Zyqva4FARrGPNmXHA';
const SUPABASE_URL = 'https://jxxbqdvqgfctzdlrwybf.supabase.co';
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

function mensagemListener() {
   return supabaseClient
      .from('msg_db')
      .on('INSERT', (resposta) => {
         addMsg(resposta.new);
      })
      .subscribe();
}

export default function ChatPage() {
   const [mensagem, setMensagem] = React.useState('');
   const route = useRouter();
   const usuarioLog = route.query.username;
   const [listaDeMensagens, setListaDeMensagens] = React.useState([]);

   React.useEffect(() => {
      supabaseClient
         .from('msg_db')
         .select('*')
         .order('id', {ascending: false})
         .then(({data}) => {
            setListaDeMensagens(data);
         });

      const sub = mensagemListener((novaMensagem) => {
         setListaDeMensagens((valorDaLista) => {
            return [novaMensagem,
               ...valorDaLista,]
         })
      }
      )
      return () => {
         sub.unsubscribe();
      }
   }, []);

   function handleNovaMensagem(novaMensagem) {
      const mensagem = {
         de: usuarioLog,
         texto: novaMensagem,
      };

      supabaseClient
         .from('msg_db')
         .insert([
            mensagem
         ])
         .then(({data}) => {
         });
      setMensagem('');
   }
   return (
      <Box
         styleSheet={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            backgroundImage: `url(https://wallpaperaccess.com/full/1166715.jpg)`,
            backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundBlendMode: 'multiply',
            color: appConfig.theme.colors.neutrals['000']
         }}
      >
         <Box
            styleSheet={{
               display: 'flex',
               flexDirection: 'column',
               flex: 1,
               boxShadow: '0 2px 10px 0 rgb(0 0 0 / 20%)',
               borderRadius: '5px',
               backgroundColor: appConfig.theme.colors.neutrals[700],
               height: '100%',
               maxWidth: '95%',
               maxHeight: '95vh',
               padding: '32px',
            }}
         >
            <Header />
            <Box
               styleSheet={{
                  position: 'relative',
                  display: 'flex',
                  flex: 1,
                  height: '80%',
                  backgroundColor: appConfig.theme.colors.neutrals[600],
                  flexDirection: 'column',
                  borderRadius: '5px',
                  padding: '16px',
               }}
            >
               <MessageList mensagens={listaDeMensagens} />
               {/* {listaDeMensagens.map((mensagemAtual) => {
                        return (
                            <li key={mensagemAtual.id}>
                                {mensagemAtual.de}: {mensagemAtual.texto}
                            </li>
                        )
                    })} */}
               <Box
                  as="form"
                  styleSheet={{
                     display: 'flex',
                     alignItems: 'center',
                  }}
               >
                  <TextField
                     value={mensagem}
                     onChange={(event) => {
                        const valor = event.target.value;
                        setMensagem(valor);
                     }}
                     onKeyPress={(event) => {
                        if (event.key === 'Enter') {
                           event.preventDefault();
                           handleNovaMensagem(mensagem);
                        }
                     }}
                     placeholder="Insira sua mensagem aqui..."
                     type="textarea"
                     styleSheet={{
                        width: '100%',
                        border: '0',
                        resize: 'none',
                        borderRadius: '5px',
                        padding: '6px 8px',
                        backgroundColor: appConfig.theme.colors.neutrals[800],
                        marginRight: '12px',
                        color: appConfig.theme.colors.neutrals[200],
                     }}
                  />
                  <ButtonSendSticker
                     onStickerClick={(sticker) => {
                        handleNovaMensagem(':sticker:' + sticker)
                     }}
                  />
               </Box>
            </Box>
         </Box>
      </Box>
   )
}

function Header() {
   return (
      <>
         <Box styleSheet={{width: '100%', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between'}} >
            <Text variant='heading5'>
               Who Types
            </Text>
            <Button
               variant='tertiary'
               colorVariant='neutral'
               label='Logout'
               href="/"
            />
         </Box>
      </>
   )
}

function MessageList(props) {
   console.log(props);
   return (
      <Box
         tag="ul"
         styleSheet={{
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column-reverse',
            flex: 1,
            color: appConfig.theme.colors.neutrals["000"],
            marginBottom: '16px',
         }}
      >
         {props.mensagens.map((mensagem) => {
            return (
               <Text
                  key={mensagem.id}
                  tag="li"
                  styleSheet={{
                     borderRadius: '5px',
                     padding: '6px',
                     marginBottom: '12px',
                     hover: {
                        backgroundColor: appConfig.theme.colors.neutrals[700],
                     }
                  }}
               >
                  <Box
                     styleSheet={{
                        marginBottom: '8px',
                     }}
                  >
                     <Image
                        styleSheet={{
                           width: '20px',
                           height: '20px',
                           borderRadius: '50%',
                           display: 'inline-block',
                           marginRight: '8px',
                        }}
                        src={`https://github.com/${mensagem.de}.png`}
                     />
                     <Text tag="strong">
                        {mensagem.de}
                     </Text>
                     <Text
                        styleSheet={{
                           fontSize: '10px',
                           marginLeft: '8px',
                           color: appConfig.theme.colors.neutrals[300],
                        }}
                        tag="span"
                     >
                        {(new Date().toLocaleDateString())}
                     </Text>
                  </Box>
                  {mensagem.texto.startsWith(':sticker:')
                     ? (
                        <Image src={mensagem.texto.replace(':sticker:', '')} />
                     )
                     : (
                        mensagem.texto
                     )}
               </Text>
            );
         })}
      </Box>
   )
}
