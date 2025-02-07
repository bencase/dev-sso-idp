export const makeHealthRoute = () => (req, res) => {
    res.sendStatus(200);
};

export const makeEnvHealthRoute = (envVarsValidationResult) => (req, res) => {
    const { errors } = envVarsValidationResult;
    if (!errors || errors.length == 0) {
        res.sendStatus(200);
        return;
    }
    res.status(500).json({
        errors: errors,
    });
};
