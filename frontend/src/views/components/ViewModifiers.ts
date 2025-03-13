type TSelectCornerRadius = "left" | "top" | "all"

function buildBorderRadius(type: TSelectCornerRadius, radius: number): string {
    switch(type) {
        case "all":
            return `${radius}px`
        case "top":
            return `${radius}px ${radius}px 0 0`
        case "left":
            return `${radius}px 0 0 ${radius}px`
    }
}

export {
    TSelectCornerRadius,
    buildBorderRadius
}