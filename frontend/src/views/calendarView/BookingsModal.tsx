import React, {useContext} from "react"
import {ModalBase} from "../components/Modal";
import { FlexBox } from '../components/view/FlexLayouts';
import { BaseButton } from '../components/Buttons';
import {CalendarContext} from "./CalendarContext";
import {NavContext} from "../navigator/NavContext";
import {BaseText} from "../../theme/CustomText";
import { DynamicSpacer, SInput, SInputTextArea, StatusLight, VerticalSpacer } from '../components/ViewElements';
import { LabelAndFieldContainer } from '../profile/ProfileViewComps';
import { Colors } from '../../theme/Theme';
import {BookingPaymentStatus} from "../bookings/BookingViewComps";
import { ProfileAvatar } from '../images/ImageDisplayViews'
import { StarList } from '../components/UserViewComps'

type TBookingsModalProps = {
    isActive: boolean,
    closeModal: () => void
}
export default function BookingsModal(props: TBookingsModalProps) {
    const { contacts, sessions } = useContext(NavContext)
    const { selectedBooking } = useContext(CalendarContext)
    const { isActive, closeModal } = props
    const session = sessions.find((s) => s._id === selectedBooking)
    const user = contacts.find((contact) => contact._id === session?.user_id)

    function cancelAndClose() {
        // cancel all changes
        closeModal()
    }
    
    return (
        <ModalBase
            isActive={isActive} setIsActive={() => {}}
            shouldCloseOnEsc={false}
        >
            <FlexBox vertical={true} style={{maxWidth: 800}}>
                <FlexBox>
                    <BaseButton action={() => {}} text={"Cancel booking"} background={Colors.RED_00} />
                    <DynamicSpacer size={1} />
                    <BaseButton text={"Close"} action={cancelAndClose} />
                </FlexBox>
                <VerticalSpacer size={25} />
                <FlexBox>
                    <FlexBox flexBias={1}>
                        <FlexBox vertical={true} style={{marginRight: 10, textAlign: "center"}}>
                            <ProfileAvatar
                                src={user?.profile_pic?.url}
                                size={100}
                            />
                            <FlexBox style={{justifyContent: "center"}}>
                                <BaseText
                                  text={`${user?.first_name} ${user?.last_name}`}
                                />
                                <StatusLight color={"green"} alignSelf={"center"} />
                            </FlexBox>

                            <StarList ratings={user!.ratings} />
                            <BaseText text={"Age: 29"} />
                            <BaseText text={"Allergies: None"} />
                            <BaseText text={"Past bookings: 4"} />
                            <DynamicSpacer size={1} />
                        </FlexBox>
                    </FlexBox>
                    <FlexBox flexBias={3} vertical={true}>
                        <FlexBox>
                            <FlexBox>
                                <FlexBox vertical={true} flexBias={3}>
                                    <LabelAndFieldContainer name={"Booking timeframe:"}>
                                        <BaseText text={"may 5th - June 14th"} />
                                    </LabelAndFieldContainer>
                                    <LabelAndFieldContainer name={"Description:"}>
                                        <SInputTextArea
                                          value={session?.description}
                                          onChange={(value) => {}}
                                          isDisabled={false}
                                          minHeight={100}
                                        />
                                    </LabelAndFieldContainer>
                                </FlexBox>
                                <FlexBox vertical={true} flexBias={1}>
                                    <LabelAndFieldContainer name={"Total charged + fee:"}>
                                        <SInput
                                          value={500.00}
                                          onChange={(value) => {}}
                                          type={"number"}
                                          isDisabled={false}
                                        />
                                    </LabelAndFieldContainer>
                                    <LabelAndFieldContainer name={"Outstanding amount:"}>
                                        <SInput
                                          value={0.00}
                                          onChange={(value) => {}}
                                          type={"number"}
                                          isDisabled={false}
                                        />
                                    </LabelAndFieldContainer>
                                    <BookingPaymentStatus status={"Paid"} />
                                </FlexBox>
                            </FlexBox>
                        </FlexBox>

                    </FlexBox>
                </FlexBox>
            </FlexBox>
        </ModalBase>
    )
}
