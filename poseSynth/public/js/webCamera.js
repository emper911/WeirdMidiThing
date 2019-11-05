function triggerAuthorizationPrompt() {

    if (!navigator.mediaDevices) {
        throw new Error("The MediaDevices API is not supported.");
    }

    return navigator.mediaDevices.getUserMedia({ video: true });
}