abstract class ISeeder {
    abstract name: string; // unique please
    abstract seed(): Promise<void>;
}

export default ISeeder;
