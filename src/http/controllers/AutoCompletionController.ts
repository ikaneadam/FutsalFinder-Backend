import { Request, Response } from 'express';
import { handleRestExceptions } from '@shared/HandleRestExceptions';
import AutoCompletionService from '@services/AutoCompletionService';

class AutoCompletionController {
    private readonly autoCompletionService: AutoCompletionService;
    constructor() {
        this.autoCompletionService = new AutoCompletionService();
    }
    public getPredictions = async (req: Request, res: Response) => {
        try {
            const searchQuery = req.query['query'] as string | undefined;
            const predictions = await this.autoCompletionService.getPredictionsBasedOnSearchQuery(
                searchQuery
            );
            return res.status(200).send(predictions);
        } catch (e) {
            handleRestExceptions(e, res);
        }
    };
}

export default AutoCompletionController;
