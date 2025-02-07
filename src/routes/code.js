import { getCodeForScope } from '../codeManagement.js';

export const makeCodeRoute = (routerParams) => (req, res) => {
    const {
        mustCheckRedirectUri: useRedirectUri,
        mustCheckClientId: useClientId,
    } = routerParams;
    const { scopeStr, redirectUri, clientId, nonce } = req.query;
    if (!scopeStr) {
        res.status(500).json({
            message: `The 'scope' query param must be specified, and must contain a space-delimited list of scopes.`,
        });
        return;
    }
    const resBody = {
        code: getCodeForScope(
            scopeStr,
            redirectUri,
            clientId,
            nonce,
            useRedirectUri,
            useClientId
        ),
    };
    res.json(resBody);
};
