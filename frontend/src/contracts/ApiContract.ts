import { IPortalUser, IAccount, EAccountRole } from '../internal/models/Account'
import { EInquiryStatus, IInquiry } from '../internal/models/Inquiry'
import {IThread} from "../internal/models/Thread";
import {ISession} from "../internal/models/Session";
import { IMessage } from '../internal/models/Message'
import { IFile } from '../internal/models/File'
import { ISkill } from '../internal/models/Skill'
import {ITransaction} from "../internal/models/Transaction";
import { IAuditRecord } from '../internal/models/AuditRecord'
import { IAddress } from '../internal/models/shared/Address'

export namespace ApiContract {
    export namespace Props {
        export interface RegisterUser {
            email: string,
            username: string,
            password: string
        }
        export interface TryLogin {
            email: string,
            password: string
        }
        export interface UpdateProfile {
            first_name?: string,
            last_name?: string,
            birthdate?: string,
            gender?: string,
            phone_number?: string,
            address?: IAddress,
            bio?: string,
            profile_pic?: string
        }
        export interface InquiryDecision {
            inquiry_id: string,
            decision: EInquiryStatus,
            artist_notes?: string
        }
        export interface SendContactMessage {
            thread_id: string,
            body: string,
            attachments: string[]
        }
        export interface UploadFile {
            file: File,
            type: string
        }
        export interface UploadFiles {
            files: File[],
            type: string
        }
        export interface DeleteAccount {
            email: string,
            password: string,
            message: string
        }
        export interface SupportRequest {
            email: string,
            subject: string,
            message: string
        }
    }

    export namespace Response {
        export interface RegisteredUser {
            username: string,
            email: string,
            token: string,
        }
        export interface Success {
            success: boolean
        }
        export interface TryLogin {
            access_token: string,
            refresh_token: string
            role: EAccountRole
        }
        export interface AccessTokenPayload {
            access_token: string
        }
        export interface SocketGroupedData {
            timestamp: string,
            contacts: IAccount[],
            threads: IThread[],
            messages: IMessage[],
            inquiries: IInquiry[],
            sessions: ISession[],
            transactions: ITransaction[],
            auditRecords: IAuditRecord[]
        }
        export interface SessionCreated {
            success: boolean,
            session_id: string
        }
        export interface Session {
            session: ISession
        }
        export interface SessionCancelled {
            session: ISession,
            transactions: ITransaction[]
        }
        export interface Transaction {
            transaction: ITransaction
        }
        export interface CompleteSession {
            session: ISession,
            transaction?: ITransaction
        }
        export interface StripeAccountOnboarding {
            success: boolean,
            stripe_id: string,
            stripe_setup_url: string
        }
        export interface StripeAccountVerify {
            email: string,
            charges_enabled: boolean,
            payouts_enabled: boolean,
            details_submitted: boolean,
            setup_url: string,
            login_url: string
        }
        export interface FileArray {
            files: IFile[]
        }
        export interface SingleFile {
            file: IFile
        }
        export interface DeleteFile {
            success: boolean,
            file_id: string
        }
        export interface SkillAdd {
            skill: ISkill
        }
        export interface SkillRefs {
            skills: ISkill[],
            accounts: IAccount[]
        }
        export interface accounts {
            accounts: IAccount[]
        }
        export interface VerifyArtist {
            information: boolean,
            address: boolean,
            media: boolean,
            payments: boolean,
            verified: boolean,
        }
        export interface ArtistDetails {
            artist: IAccount,
            storeFrontImages: IFile[],
            payments: boolean,
            inquiries: IInquiry[],
            sessions: ISession[],
            transactions: ITransaction[],
            threads: IThread[],
            messages: IMessage[],
            contacts: IAccount[],
            auditRecords: IAuditRecord[],
            followers: number
        }
        export interface PublicArtistProfile {
            artist: IAccount
            images: IFile[]
        }
        export interface FinancialSales {
            totalCard: number,
            totalCash: number,
            cardRecords: IAuditRecord[],
            cashRecords: IAuditRecord[],
        }
        export interface PendingRequests {
            pendingInquiries: IInquiry[],
            pendingSessions: ISession[],
            accounts: IAccount[]
        }
    }
}