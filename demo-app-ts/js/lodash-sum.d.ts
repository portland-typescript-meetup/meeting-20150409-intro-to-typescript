
declare module _ {
    interface LoDashStatic {
        /**
         * @param collection The collection to iterate over.
         * @param callback The function called per iteration.
         * @param thisArg The this binding of callback.
         * @return Returns the sum of the values.
         **/
        sum<T>(
            collection: Array<T>,
            callback?: ListIterator<T, number>,
            thisArg?: any): number;

        /**
         * @see _.sum
         **/
        sum<T>(
            collection: List<T>,
            callback?: ListIterator<T, number>,
            thisArg?: any): number;

        /**
         * @see _.sum
         **/
        sum<T>(
            collection: Dictionary<T>,
            callback?: ListIterator<T, number>,
            thisArg?: any): number;

        /**
         * @see _.sum
         * @param pluckValue _.pluck style callback
         **/
        sum<T>(
            collection: Array<T>,
            pluckValue: string): number;

        /**
         * @see _.sum
         * @param pluckValue _.pluck style callback
         **/
        sum<T>(
            collection: List<T>,
            pluckValue: string): number;

        /**
         * @see _.sum
         * @param pluckValue _.pluck style callback
         **/
        sum<T>(
            collection: Dictionary<T>,
            pluckValue: string): number;

        /**
         * @see _.sum
         * @param whereValue _.where style callback
         **/
        sum<W, T>(
            collection: Array<T>,
            whereValue: W): number;

        /**
         * @see _.sum
         * @param whereValue _.where style callback
         **/
        sum<W, T>(
            collection: List<T>,
            whereValue: W): number;

        /**
         * @see _.sum
         * @param whereValue _.where style callback
         **/
        sum<W, T>(
            collection: Dictionary<T>,
            whereValue: W): number;
    }
}
