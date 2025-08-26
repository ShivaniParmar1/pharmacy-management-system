// pages/sendMessage.js

import { Button, Grid, Typography } from '@mui/material'
import { Box } from '@mui/system'
import axios from 'axios'

import { sendListMessage } from '../../../api/libraries/whatsapp'

const accessToken =
  'EAAJr48Ck0lsBOZBKoUSXiD0cvw8ZC752dZAI06nS3GufbGP83HV0HeByJsPpq6MLDoIYhZAqAZCJfdvPXhrYPj6KFP2rF5fxeofIaeARVcbZCofNhqwuDJk8Ta3CwLLBnSCQjsBrfFDo9CarXkXuoTR1VGxYr31BNzy4XmQwy0U6PvEadO6pZBoItOzwZBPSZBUEP5tBbOqVs6RzUtBCXwe60wfxFZCL4OnBW2XuvfmrpnxoAZD'

const SendMessagePage = () => {
  // Function to send WhatsApp message
  const sendWhatsAppMessage = async () => {
    const response = await axios.post(
      'https://graph.facebook.com/v17.0/128759850119056/messages',

      {
        messaging_product: 'whatsapp',
        to: '919725546627',
        type: 'text',
        text: {
          body: 'hello'
        }
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    )
  }

  const sendRondomImage = async () => {
    const response = await axios.post(
      'https://graph.facebook.com/v18.0/128759850119056/messages',

      // '{\n    "messaging_product": "whatsapp",\n    "recipient_type": "individual",\n    "to": "919725546627",\n    "type": "image",\n    "image": {\n        "link": "https://source.unsplash.com/random"\n    }\n}',
      {
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: '919725546627',
        type: 'image',
        image: {
          link: 'https://source.unsplash.com/random'
        }
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`
        }
      }
    )
    console.log(response.data)
  }

  const sendLocation = async () => {
    const response = await axios.post(
      'https://graph.facebook.com/v18.0/128759850119056/messages',

      // '{\n    "messaging_product": "whatsapp",\n    "recipient_type": "individual",\n    "to": "919725546627",\n    "type": "location",\n    "location": {\n        "latitude": "22.258652",\n        "longitude": "71.192383",\n        "name": "gujarat",\n        "address": "hhh road"\n    }\n}',
      {
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: '919725546627',
        type: 'location',
        location: {
          latitude: '22.258652',
          longitude: '71.192383',
          name: 'gujarat',
          address: 'hhh road'
        }
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`
        }
      }
    )
  }

  const sendOrder = async () => {
    const response = await axios.post(
      'https://graph.facebook.com/v18.0/128759850119056/messages',

      {
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: '919725546627',
        type: 'interactive',
        interactive: {
          type: 'list',
          header: {
            type: 'text',
            text: 'Select the food item you would like'
          },
          body: {
            text: 'You will be presented with a list of options to choose from'
          },
          footer: {
            text: 'All of them are freshly packed'
          },
          action: {
            button: 'Order',
            sections: [
              {
                title: 'Section 1 - Fruit',
                rows: [
                  {
                    id: '1',
                    title: 'Apple',
                    description: 'Dozen'
                  },
                  {
                    id: '2',
                    title: 'Orange',
                    description: 'Dozen'
                  }
                ]
              },
              {
                title: 'Section 2 - Vegetables',
                rows: [
                  {
                    id: '3',
                    title: 'Spinach',
                    description: '1kg '
                  },
                  {
                    id: '2',
                    title: 'Broccoli',
                    description: '1kg'
                  }
                ]
              }
            ]
          }
        }
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`
        }
      }
    )

    console.log(response.data)
  }

  const RequestLocation = async () => {
    const response = await axios.post(
      'https://graph.facebook.com/v18.0/158579247348269/messages ',

      {
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: '919725546627',
        type: 'interactive',
        interactive: {
          type: 'location_request_message',
          body: {
            type: 'text',
            text: '<TEXT>'
          },
          action: {
            name: 'send_location'
          }
        }
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`
        }
      }
    )
  }

  return (
    <Box>
      <Typography variant='h1'>Sending WhatsApp Message</Typography>

      <div>
        <Button onClick={RequestLocation}>Request Loocation</Button>
        <Button onClick={sendWhatsAppMessage}>send message</Button>
        <Button onClick={sendRondomImage}>Send Rondom Image</Button>
        <Button onClick={sendLocation}>Send Location</Button>
        <Button onClick={sendOrder}>Send Order</Button>
        <button onClick={sendListMessage}>Send Message template</button>
      </div>
    </Box>
  )
}

export default SendMessagePage
