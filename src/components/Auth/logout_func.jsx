const logout = () => {
    localStorage.clear()
    window.location.replace('http://3.35.11.74:3000')
}

export default logout;