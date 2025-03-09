import { EAccountRole, IAccount } from '../../../models/Account.js'
import File from '../../../models/File.js'
import DateManager from '../../DateManager.js'
import { IInquiry } from '../../../models/Inquiry.js'

const HtmlComponents = {

  userProfileRow: async (user: IAccount): Promise<string> => {
    let profilePic = 's3/hosted-default-profile-pic'
    if (user.profile_pic) {
      const profileFile = await File.findById(user.profile_pic)
      if (profileFile) {
        profilePic = profileFile!.url
      }
    }

    return `
      <div style="display: flex;">
        <img
          style="width: 75px; height: 75px; border-radius: 75px; margin-right: 15px"
          src="${profilePic}"
          alt="profile-pic"
        />
        <div style="display: inline;">
          <p class="inline-text" style="font-size: 18px; font-weight: bold; margin-bottom: 5px;">${user.username}</p>
          <p class="inline-text">${user.first_name} ${user.last_name}</p>
        </div>
      </div>
    `
  },

  senderProfilePic: async (user: IAccount): Promise<string> => {
    let profilePic = 's3/profileImageDefault.png'
    if (user.profile_pic) {
      const profileFile = await File.findById(user.profile_pic)
      if (profileFile) {
        profilePic = profileFile!.url
      }
    }
    return `
    <div style="margin: auto;">
        <img
          style="width: 150px; height: 150px; border-radius: 75px; object-fit: cover;"
          src="${profilePic}"
          alt="profile-pic"
        />
        <h3 style="margin-bottom: 5px;">${user.username}</h3>
     </div>
    `
  },

  inquiry: (inquiry: IInquiry): string => {
    return `
      <div style="display: flex; justify-content: flex-start;">
        <div style="display: flex; flex-direction: column;">
          <p class="inline-text focused-text">Timeline</p>
          <p class="inline-text focused-text">Budget</p>
          <p class="inline-text focused-text">Size</p>
          <p class="inline-text focused-text">Body Location</p>
          <p class="inline-text focused-text">Around Existing Tattoo</p>
          <p class="inline-text focused-text">Description</p>
        </div>
        <span style="width: 20px"></span>
        <div style="display: flex; flex-direction: column; justify-content: space-around;">
          <p class="inline-text">${inquiry.timeline}</p>
          <p class="inline-text">${inquiry.budget}</p>
          <p class="inline-text">${inquiry.size}</p>
          <p class="inline-text">${inquiry.body_location}</p>
          <p class="inline-text">${inquiry.working_on_existing_tattoo}</p>
          <p class="inline-text">${inquiry.description}</p>
        </div>
      </div>
    `
  },

  onboardingArtist: (artist: IAccount, password: string): string => {
    return `
      <div>
      <div>
        <p class="inline-text focused-text">Artist Handle</p>
        <p class="inline-text secondary">This will be your handle for users to find you by on NodeSchedular.</p>
        <h2 class="highlight">${artist.username}</h2>
        <br />

        <p class="inline-text focused-text">Email / Login</p>
        <p class="inline-text secondary">Use this email to log in to the portal.</p>
        <h2 class="highlight">${artist.email}</h2>
        <br />

        <p class="inline-text focused-text">Password</p>
        <p class="inline-text secondary">This is your temporary password. Make sure to change this once you have logged in.</p>
        <h2 class="highlight">${password}</h2>
        <br />

        <div style="display: flex; justify-content: center">
          <h3>Get started <a href="https://domain.com/portal">here!</a></h3>
        </div>
      </div>
      <br />
    </div>
    `
  },

  dailySummaryHeading: (): string => {
    const today = DateManager.dayMonthString(new Date())
    return `
      <div>
      <h1>Your daily summary</h1>
      <p>${today}</p>
    </div>
    `
  },

  dailySummaryBody: (inquiries: number, messages: number): string => {
    return `
      <div>
      <p class="inline-text">You have <strong>${inquiries}</strong> pending inquiries</p>

      <br />

      <p class="inline-text">You have <strong>${messages}</strong> unread messages</p>

      <br />
      <br />

      <div style="text-align: center">
        <p>Log in to the <a href="https://domain.com/portal" target="_blank">Artist Portal</a> to view</p>
      </div>
    </div>
    `
  },

  buildPlatformLink: (user: IAccount, deepLinkParam: string) => {
    if (user.role === EAccountRole.USER) {
      return HtmlComponents.viewOnMobileButton(deepLinkParam)
    } else {
      return HtmlComponents.viewOnPortalButton()
    }
  },

  viewOnPortalButton: (): string => {
    return `
      <div style="margin: auto;">
        <button style="border-radius: 4px; background-color: red; padding: 5px 10px;">
          <a style="font-size: 16px; margin: 5px 10px; color: white"
          href="https://domain.com/portal" target="_blank">View on NodeSchedular</a>
        </button>
      </div>
    `
  },

  viewOnMobileButton: (deepLinkParam: string): string => {
    const link = `https://domain.com/native?${deepLinkParam}`;
    return `
      <div style="margin: auto;">
        <a 
          href="${link}" 
          target="_blank"
          style="
            display: inline-block;
            border-radius: 4px;
            background-color: red;
            padding: 10px 20px;
            font-size: 16px;
            color: white;
            text-decoration: none;
            text-align: center;
          "
        >
          View on NodeSchedular
        </a>
      </div>
  `;
  }
}

export default HtmlComponents