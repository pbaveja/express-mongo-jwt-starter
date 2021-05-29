module.exports = errorHandler;

function errorHandler(err, req, res, next) {
    // Custom app error response format
    console.log(err);
    if (err.code && err.message) {
        return res.status(err.code).json({ message: err.message });
    }
    
    // Handle 200 with message if needed
    if (err.message) {
        return res.json({ message: err.message });
    }

    // default to 404 server error
    return res.status(404).json({ message: 'Not Found' });
}