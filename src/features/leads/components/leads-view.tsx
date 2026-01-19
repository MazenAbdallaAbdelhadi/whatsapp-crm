"use client";

import { LeadsStats } from "./leads-stats";
import { LeadsTable } from "./leads-table/leads-table";
import { columns } from "./leads-table/columns";
import { MOCK_LEADS } from "../data/mock-leads";

export const LeadsView = () => {
    return (
        <div className="h-full flex-1 flex-col space-y-8 p-8 md:flex">
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Leads</h2>
                    <p className="text-muted-foreground">
                        Manage and track your potential customers and deal pipeline.
                    </p>
                </div>
                <div className="flex items-center space-x-2">
                    {/* Additional top-level actions can go here */}
                </div>
            </div>

            <LeadsStats />

            <LeadsTable data={MOCK_LEADS} columns={columns} />
        </div>
    );
};
