import express from 'express';

abstract class HttpView {
    public router = express.Router();
}

export default HttpView;
