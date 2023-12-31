import * as path from 'path';
import * as fs from 'fs';

function generateFile(directory: string, fileName: string, content: string) {
    const filePath = path.join(__dirname, directory, fileName);

    // Ensure that the directory path exists
    const directoryPath = path.dirname(filePath);
    if (!fs.existsSync(directoryPath)) {
        fs.mkdirSync(directoryPath, { recursive: true });
        console.log(`Directory created successfully: ${directoryPath}`);
    }

    // Check if the file already exists
    if (fs.existsSync(filePath)) {
        console.log(`${filePath} already exists. Skipping.`);
        return;
    }

    fs.writeFileSync(filePath, content, { encoding: 'utf-8' });
    console.log(`File created successfully:\nPath: ${filePath}\nName: ${fileName}`);
}

//used for camelcase etc.
function capitalizeName(name: string): [string, string] {
    const capitalized = name.charAt(0).toUpperCase() + name.slice(1);
    const nonCapitalized = name.charAt(0).toLowerCase() + name.slice(1);
    return [capitalized, nonCapitalized];
}

function generateController([capitalizedName, nonCapitalizedName]: [string, string]) {
    const content = `import { Request, Response } from 'express';
import * as Joi from 'joi';
import ${capitalizedName}Service from '@services/${capitalizedName}Service';
import ${capitalizedName}DAO from '@shared/dao/${capitalizedName}DAO';
import { PaginationOptions } from '@shared/pagination/pagination.options';
import BuildPaginationOptionsFromQueryParameters from '@shared/pagination/BuildPaginationOptionsFromQueryParameters';
import { validateEntityExistence } from '@shared/utils/rest/EntitiyValidation';
import { validateSchema } from '@shared/utils/rest/ValidateSchema';
import { handleRestExceptions } from '@shared/HandleRestExceptions';

class ${capitalizedName}Controller {
    private readonly ${nonCapitalizedName}Service: ${capitalizedName}Service;
    private readonly ${nonCapitalizedName}DAO: ${capitalizedName}DAO;
    
    constructor() {
        this.${nonCapitalizedName}Service = new ${capitalizedName}Service();
        this.${nonCapitalizedName}DAO = new ${capitalizedName}DAO();
    }
    
    public get${capitalizedName} = async (req: Request, res: Response) => {
        const ${nonCapitalizedName}Id = req.params.${nonCapitalizedName}Id;
        if (${nonCapitalizedName}Id === undefined) {
            await this.get${capitalizedName}s(req, res);
        } else {
            await this.getSingle${capitalizedName}(${nonCapitalizedName}Id, req, res);
        }
    };

    private getSingle${capitalizedName} = async (${nonCapitalizedName}Id: string, req: Request, res: Response) => {
        try {
            const ${nonCapitalizedName} = await this.${nonCapitalizedName}DAO.get${capitalizedName}ByUUID(${nonCapitalizedName}Id);
            validateEntityExistence(${nonCapitalizedName});
            return res.status(200).send(${nonCapitalizedName});
        } catch (error) {
            handleRestExceptions(error, res);
        }
    };

    private get${capitalizedName}s = async (req: Request, res: Response) => {
        try {
            const paginationOptions: PaginationOptions =
                await BuildPaginationOptionsFromQueryParameters.buildPaginationOptionsFromQueryParameters(
                    req
                );

            const ${nonCapitalizedName}s = await this.${nonCapitalizedName}DAO.get${capitalizedName}s(paginationOptions);
            return res.status(200).send(${nonCapitalizedName}s);
        } catch (error) {
            handleRestExceptions(error, res);
        }
    };

    private create${capitalizedName}Schema: Joi.Schema = Joi.object({
    
    });

    public create${capitalizedName} = async (req: Request, res: Response) => {
        try {
            validateSchema(this.create${capitalizedName}Schema, req.body);

            const created${capitalizedName} = await this.${nonCapitalizedName}DAO.create${capitalizedName}(req.body);

            return res.status(200).json(created${capitalizedName});
        } catch (e: any) {
            handleRestExceptions(e, res);
        }
    };
    
    private update${capitalizedName}Schema: Joi.Schema = Joi.object({
    
    }).min(1);

    public update${capitalizedName} = async (req: Request, res: Response) => {
        try {
            validateSchema(this.update${capitalizedName}Schema, req.body);
            const ${nonCapitalizedName}Id = req.params.${nonCapitalizedName}Id
            const updated${capitalizedName} = await this.${nonCapitalizedName}DAO.update${capitalizedName}(${nonCapitalizedName}Id, req.body);

            return res.status(200).json(updated${capitalizedName});
        } catch (e: any) {
            handleRestExceptions(e, res);
        }
    };
}

export default ${capitalizedName}Controller;
`;

    generateFile('src/http/controllers', `${capitalizedName}Controller.ts`, content);
}
function generateDAO([capitalizedName, nonCapitalizedName]: [string, string]) {
    const content = `import { Equal, FindOptionsWhere, Repository, UpdateResult } from 'typeorm';
import { AppDataSource } from '@/data-source';
import { ExistenceResult, parseEntityToExistenceResult } from '@shared/interfaces/EntitiyExist';
import { ${capitalizedName} } from '@shared/entities/${capitalizedName}';
import { updateEntity } from '@shared/utils/UpdateEntity';
import { Pagination } from '@shared/pagination/pagination';
import { PaginationOptions } from '@shared/pagination/pagination.options';
import EntityNotFound from '@shared/exceptions/EntityNotFound';

class ${capitalizedName}DAO {
    private ${nonCapitalizedName}Repository: Repository<${capitalizedName}>;

    constructor() {
        this.${nonCapitalizedName}Repository = AppDataSource.getRepository(${capitalizedName});
    }

    public async does${capitalizedName}Exist(${nonCapitalizedName}UUID: string): Promise<ExistenceResult<${capitalizedName}>> {
        const find${capitalizedName}Queries: FindOptionsWhere<${capitalizedName}>[] = [
            {
                uuid: Equal(${nonCapitalizedName}UUID),
            },
        ];

        const found${capitalizedName} = await this.get${capitalizedName}ByQuery(find${capitalizedName}Queries);
        return parseEntityToExistenceResult<${capitalizedName}>(found${capitalizedName});
    }

    public async get${capitalizedName}ByQuery(${nonCapitalizedName}Query: FindOptionsWhere<${capitalizedName}>[]): Promise<${capitalizedName} | null> {
        return await this.${nonCapitalizedName}Repository.findOne({
            where: ${nonCapitalizedName}Query,
        });
    }

    public async get${capitalizedName}ByUUID(${nonCapitalizedName}UUID: string): Promise<${capitalizedName} | null> {
        return await this.${nonCapitalizedName}Repository.findOne({
            where: {
                uuid: Equal(${nonCapitalizedName}UUID),
            },
        });
    }
    
    public async get${capitalizedName}s(
        options: PaginationOptions,
        filter?: FindOptionsWhere<${capitalizedName}>[]
    ): Promise<Pagination<${capitalizedName}>> {
        const [data, total] = await this.${nonCapitalizedName}Repository.findAndCount({
            where: filter,
            relations: {
               
            },
            take: options.limit,
            skip: options.page * options.limit,
        });
        return new Pagination<${capitalizedName}>({ data, total }, options);
    }
    
    public async create${capitalizedName}(create${capitalizedName}Input: Create${capitalizedName}Input): Promise<${capitalizedName}> {
        const ${nonCapitalizedName}ToCreate = new ${capitalizedName}();
        ${nonCapitalizedName}ToCreate.FOO = create${capitalizedName}Input.FOO;
        return await this.${nonCapitalizedName}Repository.save(${nonCapitalizedName}ToCreate);
    }

    public async update${capitalizedName}(${nonCapitalizedName}UUID: string, update${capitalizedName}Input: Update${capitalizedName}Input): Promise<${capitalizedName}> {
        const ${nonCapitalizedName}ToUpdate = await this.get${capitalizedName}ByUUID(${nonCapitalizedName}UUID);
        if (${nonCapitalizedName}ToUpdate === null) {
            throw new EntityNotFound();
        }
        updateEntity<${capitalizedName}>(${nonCapitalizedName}ToUpdate, update${capitalizedName}Input);
        return await this.${nonCapitalizedName}Repository.save(${nonCapitalizedName}ToUpdate);
    }
    
    public async delete${capitalizedName}(${nonCapitalizedName}UUID: string): Promise<UpdateResult> {
       return await this.${nonCapitalizedName}Repository.softDelete(${nonCapitalizedName}UUID)
    }
}

export default ${capitalizedName}DAO;
`;

    generateFile('src/shared/dao', `${capitalizedName}DAO.ts`, content);
}

function generateService([capitalizedName, nonCapitalizedName]: [string, string]) {
    const content = `import ${capitalizedName}DAO from '@shared/dao/${capitalizedName}DAO';
import errorMessages from '@shared/errorMessages';

class ${capitalizedName}Service {
    private readonly ${nonCapitalizedName}DAO: ${capitalizedName}DAO;

    constructor() {
        this.${nonCapitalizedName}DAO = new ${capitalizedName}DAO();
    }
}

export default ${capitalizedName}Service;
`;

    generateFile('src/http/services', `${capitalizedName}Service.ts`, content);
}

function generateView([capitalizedName, nonCapitalizedName]: [string, string]) {
    const content = `import express, { Request, Response } from 'express';
import HttpView from '@shared/interfaces/HttpView';
import { auth } from '@shared/middleware/Auth';
import ${capitalizedName}Controller from '@controllers/${capitalizedName}Controller';
import { Roles } from '@shared/types/Roles';

class ${capitalizedName}View extends HttpView {
    public path = '/${nonCapitalizedName}s/:${nonCapitalizedName}Id?';
    public router = express.Router();
    private controller = new ${capitalizedName}Controller();

    constructor() {
        super();
        this.routes();
    }

    public routes() {
        this.router.get(this.path, this.controller.get${capitalizedName});
        this.router.put(this.path, this.controller.update${capitalizedName});
        this.router.post(this.path, this.controller.create${capitalizedName});
    }
}

export default ${capitalizedName}View;
`;

    generateFile('src/http/views', `${capitalizedName}View.ts`, content);
}

// Get name from command line argument
const [, , name] = process.argv;

// Check if a name is provided
if (!name) {
    console.error('Usage: node generateFiles.js <name>');
    process.exit(1);
}

generateController(capitalizeName(name));
generateDAO(capitalizeName(name));
generateService(capitalizeName(name));
generateView(capitalizeName(name));
