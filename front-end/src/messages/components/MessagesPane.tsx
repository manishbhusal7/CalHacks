import * as React from 'react';
import Box from '@mui/joy/Box';
import Sheet from '@mui/joy/Sheet';
import Stack from '@mui/joy/Stack';
import AvatarWithStatus from './AvatarWithStatus';
import ChatBubble from './ChatBubble';
import MessageInput from './MessageInput';
import MessagesPaneHeader from './MessagesPaneHeader';
import { ChatProps, MessageProps } from '../types';
import { useState } from 'react';
import fetchApiData from '../../api';

type MessagesPaneProps = {
    chat: ChatProps;
};

export default function MessagesPane(props: MessagesPaneProps) {
    const { chat } = props;
    const [chatMessages, setChatMessages] = React.useState(chat.messages);
    const [textAreaValue, setTextAreaValue] = React.useState('');
    const [apiData, setApiData] = useState(null);

    const onSubmit = async () => {
        const newId = chatMessages.length + 1;
        const newIdString = newId.toString();
        const chatMessageBuff = [
            ...chatMessages,
            {
                id: newIdString,
                sender: 'You',
                content: textAreaValue,
                timestamp: 'Just now',
            },
        ];

        setChatMessages(chatMessageBuff);

        try {
            const data = await fetchApiData(textAreaValue);
            setApiData(data);
            const content = data.choices[0].message.content.slice(0,100);
            console.log('Data fetched: ', JSON.stringify(data));
            console.log(`message: ${content}`);
            chatMessageBuff.push(
                {
                    id: newIdString,
                    sender: 'bot',
                    content: content,
                    timestamp: 'Just now',
                },
            );
            setChatMessages([
                ...chatMessageBuff,
            ]);
        } catch (error) {
            console.error('Error fetching data: ', error);
        }
        // fetchData();
    };

    React.useEffect(() => {
        setChatMessages(chat.messages);
    }, [chat.messages]);

    return (
        <Sheet
            sx={{
                height: { xs: 'calc(100dvh - var(--Header-height))', md: '100dvh' },
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: 'background.level1',
            }}
        >
            <MessagesPaneHeader sender={chat.sender} />
            <Box
                sx={{
                    display: 'flex',
                    flex: 1,
                    minHeight: 0,
                    px: 2,
                    py: 3,
                    overflowY: 'scroll',
                    flexDirection: 'column-reverse',
                }}
            >
                <Stack spacing={2} sx={{ justifyContent: 'flex-end' }}>
                    {chatMessages.map((message: MessageProps, index: number) => {
                        const isYou = message.sender === 'You';
                        return (
                            <Stack
                                key={index}
                                direction="row"
                                spacing={2}
                                sx={{ flexDirection: isYou ? 'row-reverse' : 'row' }}
                            >
                                {message.sender !== 'You' && (
                                    <AvatarWithStatus
                                        // online={message.sender.online}
                                        // src={message.sender.avatar}
                                    />
                                )}
                                <ChatBubble variant={isYou ? 'sent' : 'received'} {...message} />
                            </Stack>
                        );
                    })}
                </Stack>
            </Box>
            <MessageInput
                textAreaValue={textAreaValue}
                setTextAreaValue={setTextAreaValue}
                onSubmit={onSubmit}
            />
        </Sheet>
    );
}
