const UrlParams = () => {
  const urlParams = new URLSearchParams(window.location.search)

  return {
    groupName: urlParams.get('platform_group_name'),
    artistUsername: urlParams.get('artist'),
    isStripeReturn: urlParams.get('stripe_return') === 'true',
    isStripeRefresh: urlParams.get('stripe_refresh') === 'true',
  }
}

export default UrlParams