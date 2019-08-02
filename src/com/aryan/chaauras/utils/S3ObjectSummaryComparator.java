package com.aryan.chaauras.utils;

import com.amazonaws.services.s3.model.S3ObjectSummary;

import java.util.Comparator;

/**
 * Created by samarth on 25/03/15.
 */
public class S3ObjectSummaryComparator implements Comparator<S3ObjectSummary> {

    private boolean sortByLatestModifiedFirst = true;

    /**
     *
     * @param sortByLatestModifiedFirst
     */
    public S3ObjectSummaryComparator(boolean sortByLatestModifiedFirst) {
        this.sortByLatestModifiedFirst = sortByLatestModifiedFirst;
    }

    public S3ObjectSummaryComparator() {
    }

    public boolean isSortByLatestModifiedFirst() {
        return sortByLatestModifiedFirst;
    }

    public void setSortByLatestModifiedFirst(boolean sortByLatestModifiedFirst) {
        this.sortByLatestModifiedFirst = sortByLatestModifiedFirst;
    }

    /**
     *
     * @param fileSummary1
     * @param fileSummary2
     * @return
     */
    @Override public int compare(S3ObjectSummary fileSummary1, S3ObjectSummary fileSummary2) {
        /**
         * If sortByLatestModifiedFirst is true show latest modified object first
         */
        if(this.sortByLatestModifiedFirst){
            return fileSummary2.getLastModified().compareTo(fileSummary1.getLastModified());
        }
        return fileSummary1.getLastModified().compareTo(fileSummary2.getLastModified());
    }
}
