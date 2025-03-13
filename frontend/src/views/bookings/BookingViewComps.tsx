import {BorderRadius, Colors} from "../../theme/Theme";
import {DynamicSpacer, HorizontalSpacer, Icon} from "../components/ViewElements";
import {BaseText} from "../../theme/CustomText";
import React from "react";
import {RChildren} from "../../types/GenericTypes";
import {ISession} from "../../internal/models/Session";
import {FlexBox} from "../components/view/FlexLayouts";

type TEventItemContainerProps = RChildren & {
    isSelected: boolean,
    action: () => void
}
const EventItemContainer = (props: TEventItemContainerProps) => {
    const {isSelected, action, children} = props
    return (
        <div style={{
            display: "flex",
            justifyContent: "space-around",
            background: isSelected ? Colors.DARK_RED : Colors.LIGHT_GREY_00,
            padding: 10,
            borderRadius: BorderRadius.r4,
            margin: 2,
            borderWidth: 1,
            cursor: "pointer"
        }}
             onClick={action}
        >
            {children}
        </div>
    )
}

type TCreateEventProps = {
    onClick: () => void
}
const CreateEventListItem = (props: TCreateEventProps) => {
    const {onClick} = props
    return (
        <EventItemContainer
            isSelected={false}
            action={onClick}
        >
            <DynamicSpacer size={1} />
            <Icon name={"fa-plus"} margin={0} color={Colors.RED_00} />
            <HorizontalSpacer size={5} />
            <BaseText text={"Create new"} color={Colors.RED_00} />
            <DynamicSpacer size={1} />
        </EventItemContainer>
    )
}

const BookingPaymentStatus = ({status}: {status: "Paid" | "Due"}) => {
    return (
        <div style={{
            borderRadius: BorderRadius.r10,
            backgroundColor: status === "Paid" ? Colors.GREEN_00 : Colors.YELLOW,
            margin: 10
        }}>
            <BaseText text={status} styles={{
                margin: 10,
                display: "block"
            }} />
        </div>
    )
}

export {
    BookingPaymentStatus,
    CreateEventListItem
}