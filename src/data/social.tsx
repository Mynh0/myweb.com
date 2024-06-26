import LinkedInIcon from '@/public/social/linkedin.svg'
import TiktokIcon from '@/public/social/tiktok.png'
import GoodreadsIcon from '@/public/social/goodreads.svg'
import { BadgeSocialProps } from '@notion-x/src/components/BadgeSocial'

const socials: BadgeSocialProps[] = [
  {
    id: 'linkedin',
    title: 'LinkedIn',
    icon: LinkedInIcon,
    url: 'https://www.linkedin.com/in/myhanguyen07/'
  },
  {
    id: 'tiktok',
    title: 'TikTok',
    icon: TiktokIcon,
    url: 'https://www.tiktok.com/@mitaplamnguoilon?is_from_webapp=1&sender_device=pc',
  },
  {
    id: 'goodreads',
    title: 'Goodreads',
    icon: GoodreadsIcon,
    url: 'https://www.goodreads.com/user/show/177211704-ha-my',
  }
] 

export default socials