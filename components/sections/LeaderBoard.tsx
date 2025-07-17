import React from "react";
import { FadeInWhenVisible } from "../FadeInWhenVisible";
import { Title } from "../Title";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { motion } from "framer-motion";

interface School {
  rank: number;
  schoolName: string;
  numberOfPlaces: number;
  numberOfNominations: number;
  totalPoints: number;
}

interface TableRowStyles {
  rowGradient: string;
  textStyle: string;
}

interface CellStyles {
  fontSize: string;
  textColor: string;
  gradient?: string;
  dropShadow?: string;
}

const LeaderBoard = () => {
  const leaderboard: School[] = [];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-black via-gray-900 to-black">
      <section
        id="leaderboard"
        className="min-h-screen py-8 md:py-16 lg:py-24 relative z-10 flex flex-col items-center justify-center"
      >
        <div className="z-10 px-4 md:px-8 lg:px-16 w-full max-w-7xl mx-auto text-center">
          <FadeInWhenVisible>
            <div className="flex flex-col items-center mb-24">
              <Title subText="LeaderBoard" />
            </div>
          </FadeInWhenVisible>

          <div className="rounded-3xl overflow-hidden comicFont">
            {!leaderboard ? (
              <div className="min-h-[50vh] flex flex-col items-center justify-center bg-black text-white text-center px-4 py-10">
                <motion.h2
                  className="text-3xl md:text-4xl font-extrabold tracking-wide bg-gradient-to-r from-pink-600 via-orange-400 to-yellow-400 
    bg-clip-text text-transparent"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1 }}
                >
                  Leaderboard information is on the way...
                </motion.h2>

                <motion.p
                  className="mt-6 text-lg text-gray-400/80 max-w-md mx-auto"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
                >
                  Get ready to see which schools are leading the competition!
                </motion.p>

                <div className="flex space-x-2 mt-8">
                  {[...Array(3)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="w-4 h-4 bg-gradient-to-r from-pink-600 via-orange-400 to-yellow-400 rounded-full"
                      animate={{
                        scale: [1, 1.5, 1],
                        opacity: [0.6, 1, 0.6],
                      }}
                      transition={{
                        repeat: Infinity,
                        duration: 1,
                        delay: i * 0.2,
                        ease: "easeInOut",
                      }}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <Table className="w-full border-none">
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="bg-gradient-to-t from-[#d72b59] to-[#fbe851] bg-clip-text text-transparent font-bold text-left py-6 px-6 w-[100px] tracking-wider">
                      Rank
                    </TableHead>
                    <TableHead className="bg-gradient-to-t from-[#d72b59] to-[#fbe851] bg-clip-text text-transparent font-bold text-left py-6 px-6 tracking-wider">
                      School Name
                    </TableHead>
                    <TableHead className="bg-gradient-to-t from-[#d72b59] to-[#fbe851] bg-clip-text text-transparent font-bold text-center py-6 px-6 tracking-wider">
                      Major Comp Places
                    </TableHead>
                    <TableHead className="bg-gradient-to-t from-[#d72b59] to-[#fbe851] bg-clip-text text-transparent font-bold text-center py-6 px-6 tracking-wider">
                      Other Comp Nominations
                    </TableHead>
                    <TableHead className="bg-gradient-to-t from-[#d72b59] to-[#fbe851] bg-clip-text text-transparent font-bold text-right py-6 px-6 tracking-wider">
                      Total Points
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {leaderboard &&
                    leaderboard.map((school: School, index: number) => {
                      const rowStyles: TableRowStyles = {
                        rowGradient:
                          index === 0
                            ? "bg-gradient-to-r from-yellow-900/30 to-yellow-800/20 border-l-4 border-l-yellow-400 shadow-lg"
                            : "",
                        textStyle:
                          "border-gray-700/50 transition-all duration-300",
                      };

                      const rankCellStyles: CellStyles = {
                        fontSize: index === 0 ? "text-3xl" : "text-xl",
                        textColor: "text-white",
                        gradient:
                          index === 0
                            ? "bg-gradient-to-t from-[#d72b59] to-[#fbe851] bg-clip-text text-transparent"
                            : "",
                        dropShadow: index === 0 ? "drop-shadow-glow" : "",
                      };

                      return (
                        <TableRow
                          key={index}
                          className={`${rowStyles.textStyle} ${rowStyles.rowGradient}`}
                        >
                          <TableCell className="py-5 px-6">
                            <span
                              className={`font-bold ${rankCellStyles.fontSize} ${
                                rankCellStyles.gradient ||
                                rankCellStyles.textColor
                              } ${rankCellStyles.dropShadow || ""}`}
                            >
                              #{school.rank}
                            </span>
                          </TableCell>
                          <TableCell className="text-white font-medium py-5 px-6 text-lg">
                            {school.schoolName}
                          </TableCell>
                          <TableCell className="text-white font-mono text-lg font-bold text-center py-5 px-6">
                            <span className="bg-gray-800/50 px-4 py-1 rounded-full">
                              {school.numberOfPlaces}
                            </span>
                          </TableCell>
                          <TableCell className="text-white font-mono text-lg font-bold text-center py-5 px-6">
                            <span className="bg-gray-800/50 px-4 py-1 rounded-full">
                              {school.numberOfNominations}
                            </span>
                          </TableCell>
                          <TableCell className="text-right py-5 px-6">
                            <span
                              className={`font-bold ${
                                index === 0
                                  ? "text-2xl bg-gradient-to-t from-[#d72b59] to-[#fbe851] bg-clip-text text-transparent drop-shadow-glow"
                                  : "text-xl text-white"
                              }`}
                            >
                              {school.totalPoints}
                            </span>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default LeaderBoard;
