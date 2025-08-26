import { gql } from '@apollo/client'

export const SEND_WHATSAPP_FLOW = gql`
  mutation SendWhatsAppFlow($messagingProduct: String!, $to: String!, $type: String!, $template: TemplateInput!) {
    sendWhatsAppFlow(messagingProduct: $messagingProduct, to: $to, type: $type, template: $template) {
      id
      status
    }
  }
`
